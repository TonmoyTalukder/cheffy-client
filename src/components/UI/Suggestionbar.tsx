import WhomTOFollow from '../suggestion/WhomTOFollow';

const SuggestionBar = () => {
  return (
    <div
      className="max-h-screen w-full suggestion-content"
      style={{
        zIndex: 50,
      }}
    >
      <div className="p-4 z-10">
        <WhomTOFollow />
      </div>
    </div>
  );
};

export default SuggestionBar;
