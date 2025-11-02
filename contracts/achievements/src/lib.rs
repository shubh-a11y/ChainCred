#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, String, Vec,
};

#[derive(Clone)]
#[contracttype]
pub struct Achievement {
    pub id: u64,
    pub owner: Address,
    pub title: String,
    pub description: String,
    pub category: String,      // e.g., "coding", "certification", "poetry"
    pub evidence_uri: String,  // e.g., IPFS CID or URL
    pub timestamp: u64,        // created at (env.ledger.timestamp)
    pub status: String,        // "draft" | "minted" | "verified"
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    NextId,
    AchievementById(u64),
    AchievementsByOwner(Address),
    AchievementsByCategory(String),
    Admin,
    Verifier(Address),
}

fn require_admin(env: &Env) {
    let admin: Address = env
        .storage()
        .persistent()
        .get::<_, Address>(&DataKey::Admin)
        .expect("admin not set");
    admin.require_auth();
}

fn require_owner(_env: &Env, owner: &Address) {
    owner.require_auth();
}

fn is_verifier(env: &Env, addr: &Address) -> bool {
    env.storage()
        .persistent()
        .has(&DataKey::Verifier(addr.clone()))
}

fn push_id(env: &Env, key: DataKey, id: u64) {
    let mut ids: Vec<u64> = env
        .storage()
        .persistent()
        .get::<_, Vec<u64>>(&key)
        .unwrap_or(Vec::new(&env));
    ids.push_back(id);
    env.storage().persistent().set(&key, &ids);
}

#[contract]
pub struct AchievementsContract;

#[contractimpl]
impl AchievementsContract {
    pub fn init(env: Env, admin: Address) {
        if env.storage().persistent().has(&DataKey::Admin) {
            panic!("already-initialized");
        }
        admin.require_auth();
        env.storage().persistent().set(&DataKey::Admin, &admin);
        env.storage().persistent().set(&DataKey::NextId, &0u64);
    }

    pub fn add_verifier(env: Env, verifier: Address) {
        require_admin(&env);
        env.storage()
            .persistent()
            .set(&DataKey::Verifier(verifier), &symbol_short!("Y"));
    }

    pub fn remove_verifier(env: Env, verifier: Address) {
        require_admin(&env);
        env.storage().persistent().remove(&DataKey::Verifier(verifier));
    }

    pub fn create_achievement(
        env: Env,
        owner: Address,
        title: String,
        description: String,
        category: String,
        evidence_uri: String,
    ) -> u64 {
        owner.require_auth();

        let mut next_id: u64 = env.storage().persistent().get(&DataKey::NextId).unwrap_or(0);
        next_id += 1;
        env.storage().persistent().set(&DataKey::NextId, &next_id);

        let ts = env.ledger().timestamp();
        let ach = Achievement {
            id: next_id,
            owner: owner.clone(),
            title,
            description,
            category: category.clone(),
            evidence_uri,
            timestamp: ts,
            status: String::from_str(&env, "draft"),
        };

        env.storage().persistent().set(&DataKey::AchievementById(next_id), &ach);
        push_id(&env, DataKey::AchievementsByOwner(owner), next_id);
        push_id(&env, DataKey::AchievementsByCategory(category), next_id);

        ach_emit(&env, "AchievementCreated", next_id);
        next_id
    }

    pub fn update_achievement(
        env: Env,
        id: u64,
        title: Option<String>,
        description: Option<String>,
        category: Option<String>,
        evidence_uri: Option<String>,
    ) -> Achievement {
        let mut ach: Achievement = env.storage().persistent().get(&DataKey::AchievementById(id)).expect("achievement-not-found");
        require_owner(&env, &ach.owner);

        if ach.status == String::from_str(&env, "minted") || ach.status == String::from_str(&env, "verified") {
            panic!("cannot-update-after-mint");
        }

        if let Some(t) = title {
            ach.title = t;
        }
        if let Some(d) = description {
            ach.description = d;
        }
        if let Some(c) = category {
            ach.category = c;
        }
        if let Some(e) = evidence_uri {
            ach.evidence_uri = e;
        }

        env.storage().persistent().set(&DataKey::AchievementById(id), &ach);
        ach_emit(&env, "AchievementUpdated", id);
        ach
    }

    pub fn mint_achievement(env: Env, id: u64) -> Achievement {
        let mut ach: Achievement = env.storage().persistent().get(&DataKey::AchievementById(id)).expect("achievement-not-found");
        require_owner(&env, &ach.owner);

        ach.status = String::from_str(&env, "minted");
        env.storage().persistent().set(&DataKey::AchievementById(id), &ach);

        ach_emit(&env, "AchievementMinted", id);
        ach
    }

    pub fn verify_achievement(env: Env, id: u64, verifier: Address) -> Achievement {
        verifier.require_auth();
        let mut ach: Achievement = env.storage().persistent().get(&DataKey::AchievementById(id)).expect("achievement-not-found");

        if !is_verifier(&env, &verifier) {
            panic!("not-a-verifier");
        }

        ach.status = String::from_str(&env, "verified");
        env.storage().persistent().set(&DataKey::AchievementById(id), &ach);
        ach_emit(&env, "AchievementVerified", id);
        ach
    }

    pub fn get_achievement(env: Env, id: u64) -> Achievement {
        env.storage().persistent().get(&DataKey::AchievementById(id)).expect("achievement-not-found")
    }

    pub fn list_by_owner(env: Env, owner: Address) -> Vec<Achievement> {
        let ids: Vec<u64> = env.storage().persistent().get(&DataKey::AchievementsByOwner(owner)).unwrap_or(Vec::new(&env));
        map_ids(&env, ids)
    }

    pub fn list_by_category(env: Env, category: String) -> Vec<Achievement> {
        let ids: Vec<u64> = env.storage().persistent().get(&DataKey::AchievementsByCategory(category)).unwrap_or(Vec::new(&env));
        map_ids(&env, ids)
    }
}

// Helper: Fetch achievements from id list
fn map_ids(env: &Env, ids: Vec<u64>) -> Vec<Achievement> {
    let mut res = Vec::new(&env);
    for id in ids.iter() {
        let ach: Achievement = env.storage().persistent().get(&DataKey::AchievementById(id)).expect("achievement-not-found");
        res.push_back(ach);
    }
    res
}

// Helper: Emit events
fn ach_emit(env: &Env, event: &str, id: u64) {
    env.events().publish(
        (symbol_short!("ACH"), String::from_str(env, event)),
        id,
    );
}

// Compile unit tests only during `cargo test`
#[cfg(test)]
mod test;
