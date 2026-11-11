#!/usr/bin/env bats

load '../../../node_modules/bats-support/load'
load '../../../node_modules/bats-assert/load'

@test "ESM smoke test" {
    run node ./e2e/smoke.js
    assert_output 'e781c3c3c3c3819f'
}