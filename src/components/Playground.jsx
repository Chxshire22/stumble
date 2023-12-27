import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";

function Playground(props) {

	let {profileUid, setProfileUid} = props;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    console.log(user);
  }, []);

	const navigate = useNavigate()

  const logout = async (e) => {
    e.preventDefault();
    signOut(auth);
  };

	const user1uid = 'jD42x63WiQa7maeM6ZmAJ0JLBXe2'

	const handleClick = () =>{
		setProfileUid(user1uid)
		if (profileUid){
			navigate(`/profile/${profileUid}`)
		}
	}

  return (
    <div className="authentication flex-center-col">
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
