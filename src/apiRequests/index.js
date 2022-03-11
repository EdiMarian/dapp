const getNfts = async () => {
  let response = await fetch(
    'https://api.elrond.com/nfts?collection=EQUISTAR-3f393f'
  );
  let data = await response.json();
};

export default getNfts;
