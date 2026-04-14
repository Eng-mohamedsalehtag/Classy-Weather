const Search = ({ location, setLocation }) => {
  return (
    <input
      type="text"
      placeholder="Search any city..."
      value={location}
      onChange={(e) => setLocation(e.target.value)}
    />
  );
};

export default Search;
