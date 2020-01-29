# react-rtk-github-issues-example-using-easy-peasy

In order to understand the differences between [Redux Toolkit](https://github.com/reduxjs/redux-toolkit) and [easy-peasy](https://github.com/ctrlplusb/easy-peasy) I have "converted" the Redux Toolkit advanced [Tutorial](https://redux-toolkit.js.org/tutorials/advanced-tutorial) [(source-code)](https://github.com/reduxjs/rtk-github-issues-example) to using easy-peasy. My intention was to "convert" the state manangement without touching the original code unless it was related to Redux Toolkit. After some reasearch I also couldn't find a good example of a larger app using "easy-peasy" [(Kutt.it is worth checking out)](https://github.com/thedevs-network/kutt) so maybe this can also help also other easy-peasy newcomers! I would like to keep one branch of the repo as close as possible to the rtk example, and also have another branch with "easy-peasy-bestpractices", feel free to PR.

(rtk guys, sorry for stealing your app!)

[View in codesandbox](https://codesandbox.io/s/github/denu5/react-rtk-github-issues-example-using-easy-peasy)

### React Codebase Source Overview

The codebase is already laid out in a "feature folder" structure, The main pieces are:

The original project structure from the rtk example:

- `/api`: fetching functions and TS types for the Github Issues API
- `/app`: main `<App>` component
- `/components`: components that are reused in multiple places
- `/features`
  - `/issueDetails:` components for the Issue Details page
  - `/issuesList`: components for the Issues List display
  - `/repoSearch`: components for the Repo Search form
- `/utils`: various string utility functions

Additional folders for easy-peasy:

- `/model`: easy-peasy store models
- `/store`: easy-peasy store config and typed hooks
- `/services`: services that can be used with easy-peasy injector
