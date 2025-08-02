#!/usr/bin/env bats

load '../../../node_modules/bats-support/load'
load '../../../node_modules/bats-assert/load'

@test "Common JS smoke test" {
    run node ./e2e/smoke.cjs
    assert_output 'e781c3c3c3c3819f'
}

@test "ESM smoke test" {
    run node ./e2e/smoke.mjs
    assert_output 'e781c3c3c3c3819f'
}