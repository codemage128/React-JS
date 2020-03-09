export default class AssetStore{
   initializeData() {
      this.isLoading = true;
      query({ query: assetList })
        .then(
          action(data => {
            this.assets = data.assets.edges.map(x => x.node);
          })
        )
        .finally(action(() => (this.isLoading = false)));
    }
}