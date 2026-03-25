const CategoryFilter = ({ setCategory }) => {
  return (
    <select className="category-filter" onChange={e => setCategory(e.target.value)}>
      <option value="">All Categories</option>
      <option value="Crops">Crops</option>
      <option value="Harvesting">Harvesting</option>
      <option value="Soil">Soil Management</option>
      <option value="Irrigation">Irrigation</option>
      <option value="Organic">Organic Farming</option>
    </select>
  );
};

export default CategoryFilter;
