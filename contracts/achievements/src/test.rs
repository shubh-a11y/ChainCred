#![cfg(test)]

use soroban_sdk::{
    testutils::{Address as _},
    Address, Env, String,
};

use crate::{AchievementsContract, AchievementsContractClient, Achievement};

#[test]
fn lifecycle_happy_path() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let owner = Address::generate(&env);
    let verifier = Address::generate(&env);

    // deploy
    let contract_id = env.register(AchievementsContract, ());
    let client = AchievementsContractClient::new(&env, &contract_id);

    // init
    client.init(&admin);

    // add verifier
    client.add_verifier(&verifier);

    // create
    let id = client.create_achievement(
        &owner,
        &String::from_str(&env, "100-day streak"),
        &String::from_str(&env, "Solved 750+ problems and maintained daily practice"),
        &String::from_str(&env, "coding"),
        &String::from_str(&env, "ipfs://cid123"),
    );

    // update (still draft)
    let _updated = client.update_achievement(
        &id,
        &Some(String::from_str(&env, "101-day streak")),
        &None,
        &None,
        &Some(String::from_str(&env, "ipfs://cid456")),
    );

    // mint
    let minted: Achievement = client.mint_achievement(&id);
    assert_eq!(minted.status, String::from_str(&env, "minted"));

    // verify
    let verified: Achievement = client.verify_achievement(&id, &verifier);
    assert_eq!(verified.status, String::from_str(&env, "verified"));

    // list by owner
    let mine = client.list_by_owner(&owner);
    assert_eq!(mine.len(), 1);

    // get
    let got = client.get_achievement(&id);
    assert_eq!(got.id, id);
}
