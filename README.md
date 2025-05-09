# Nimiq Utils

Simple helper libraries for nimiq frontends.

Read the [documentation](https://www.nimiq.com/developers/build/nimiq-utils) for more information.

## Development

Run `yarn` to install the dependencies.

### Running tests

Run `yarn test` to run all tests.

#### RPC snapshot testing

The test suite includes snapshot based RPC testing for `AlbatrossPolicy` and `SupplyCalculator`. This system captures RPC responses as snapshots, allowing faster test runs and offline testing.

- Snapshots are stored in the `tests/__snapshots__/` directory.
- Tests use these snapshots by default instead of making actual RPC calls.
- To update snapshots with fresh RPC responses, run `yarn test:update`.

This ensures that our client-side calculations always match the actual RPC implementation, without requiring a live connection for each test run.
