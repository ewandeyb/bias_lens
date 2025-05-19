# BiasLens
BiasCheck is a browser extension designed to detect political bias in news
articles in real time. It helps users identify subtle or overt biases, promotes
media literacy, and encourages balanced news consumption by recommending
alternative perspectives—all without disrupting the browsing experience. Unlike
existing tools that analyze entire websites or require users to visit external
platforms, BiasCheck focuses on individual articles and integrates seamlessly
into the user's workflow.

<!-- 1. Clone the main project repository. -->
<!-- 2. Get GNews API key. Get Mistral API key. (For Mistral agent in a separate -->
<!--    backend repo: Input: "Summarize: [news text]", Output: "Short summary.", -->
<!--    Context: news summarization, small free model). -->
<!-- 3. Create a separate repository for the backend server to store API keys. -->
<!-- 4. Add API keys to the backend server. -->
<!-- 5. npm install in the main project repository. -->
<!-- 6. npm run build in the main project repository (creates dist folder). -->
<!-- 7. Load dist folder from the main project repository into Chrome extensions ("Load unpacked"). -->

## Building from source

1. Clone the repository.

```bash
git clone --depth=1 https://github.com/ewandeyb/bias_lens/
cd bias_lens
```
2. Obtain a [GNews](https://gnews.io/) API Key.
3. Obtain a [Mistral AI](https://mistral.ai/) or any other LLM API Key.
4. Create your personal backend repository for storing the API Keys.
  - This backend repo will also be handling the calls to your LLM Agent.
  - See the following link [*Agents in Mistral*](https://docs.mistral.ai/capabilities/agents/)
5. Set the parameters for your LLM agent to the following:
  - Summarize: [news text]"
  - Output: "Short summary."
  - Context: news summarization, small free model
6. Install `npm` dependencies.
```bash
npm install
```
7. Build the extension bundle. This should create a `/dist` directory, which
   will contain your local extension.
```bash
npm run build
```
8. Go to your Chromium browser settings, and enable *Developer Mode*.
9. Load an unpacked extension.
10. Select the generated `./dist` directory.
11. You should now be able to get the extension working when you visit a
    supported news site.
