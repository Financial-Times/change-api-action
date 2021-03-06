
# Change API Action

GitHub action for the Change API.


## Usage

To use this action, create the following file in your GitHub repo:

```
.github/workflows/change-api.yml
```

```yml
on:
  release: [created]

jobs:
  make-change-log:
    runs-on: ubuntu-latest
    name: Create new change log
    steps:
      - uses: actions/checkout@v2
      - uses: Financial-Times/change-api-action@v1
        name: Create new change log
        with:
          # Required
          # Enter the x-api-key header value for authenticating the request to Change API.
          # Create a key by following the instructions here
          # https://docs.google.com/document/d/1Ju84f1jtAmxmHtsyGfcyxdG3ZWrhuN9GrNnBxjVWhi4/edit
          change-api-key: ${{ secrets.CHANGE_API_KEY }}
          # Required
          # Enter the systemcode of the system being changed.
          system-code: "jake"
          # Required
          # Enter the environment in which the system is being changed.
          environment: prod
          # Optional
          # Enter comma-separated list of Slack channel names for notifications.
          slack-channels: "ft-changes-test,origami-deploys"
```

You can do this by running the following command from a repo:

```bash
mkdir -p .github/workflows && curl https://raw.githubusercontent.com/Financial-Times/change-api-action/v1/example.yml --output .github/workflows/change-api.yml
```

