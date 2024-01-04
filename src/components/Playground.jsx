import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import PlacesAutocomplete,{geocodeByAddress, getLatLng} from "react-places-autocomplete";

function Playground(props) {
  let { profileUid, setProfileUid } = props;

  const [user, setUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    console.log(user);
  }, []);

  const navigate = useNavigate();

  const logout = async (e) => {
    e.preventDefault();
    signOut(auth);
  };

  const user1uid = "jD42x63WiQa7maeM6ZmAJ0JLBXe2";

  const handleClick = () => {
    setProfileUid(user1uid)
		navigate(`/profile/${profileUid}`);
  };

	useEffect(()=>{
		const path = window.location.pathname;
		console.log(path)
	},[])




	// AUTOCOMPLETE PLAYGROUND
	const [address, setAddress] = useState("")
	const [coordinates, setCoordinates] = useState({
		lat:null, 
		lng:null,
	})
	const handleSelect = async value =>{
		const results = await geocodeByAddress(value);
		const ll = await getLatLng(results[0])
		console.log(ll)
		setAddress(value)
		setCoordinates(ll)
	}

  return (
    <div className="authentication flex-center-col">
	      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
									{...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      <header className="auth-header">
        <div className="auth-header-logo">
          <img
            className="logo-earth"
            src="src/assets/images/flamenco-134.webp"
            alt=""
          />
        </div>
        <div className="auth-header-content">
          <h1 className="auth-page-header">Stumble</h1>
          {/*<p className="tagline"> explore with us</p>*/}
          <p className="tagline">{user?.email}</p>
        </div>
      </header>

      <button onClick={handleClick}>user1</button>

      <button onClick={logout} className="btn-base auth-page-btn">
        Logout
      </button>
      <div className="login-image">
        <img src="src/assets/images/flamenco-camping.webp" alt="" />
      </div>
    </div>
  );
}

export default Playground;
