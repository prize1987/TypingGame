const request = async (url) => {
  try {
    const response = await fetch(url);
    const json = await response.json();

    if (response.ok) {
      return json;
    } else {
      throw new Error({
        status: response.status,
        msg: json.message,
      });
    }
  } catch (e) {
    return e;
  }
};

const fetchWords = async () => {
  const url = 'https://my-json-server.typicode.com/kakaopay-fe/resources/words';
  const data = await request(url);

  return data;
};

export { fetchWords };
