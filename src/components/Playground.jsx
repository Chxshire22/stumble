import { useEffect, useState } from "react";
// import {useNavigate} from "react-router-dom";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut,
} from "firebase/auth";
import { auth } from "./firebase";

function Playground() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [user, setUser] = useState({});

	useEffect(()=>{
		onAuthStateChanged(auth, (currentUser)=>setUser(currentUser))
	},[])

	// const navigate = useNavigate();

	const register = async (e) => {
		e.preventDefault()
		try {
			const user = await createUserWithEmailAndPassword(auth, email, password);
			console.log(user);
			console.log(auth);
			setEmail("");
			setPassword("");
		} catch (error) {
			console.log(error.message);
		}
	};

	const login = async (e) => {
		e.preventDefault()
		try {
			const user = await signInWithEmailAndPassword(auth, email, password);
			console.log(user);
			console.log(auth);
			setEmail("");
			setPassword("");
		} catch (error) {
			console.log(error.message);
		}
	};

	const logout = async(e) => {
		e.preventDefault()
		signOut(auth)
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
			<form className="auth-form flex-center-col">
				<input
					value={email}
					autoFocus
					placeholder="Email"
					className="auth-page-input"
					type="email"
					onChange={(e) => {
						setEmail(e.target.value);
					}}
				/>
				<input
					value={password}
					placeholder="Password"
					className="auth-page-input"
					type="password"
					onChange={(e) => {
						setPassword(e.target.value);
					}}
				/>
				<div className="auth-page-btns flex-center-row">
					<button onClick={register} className="btn-base auth-page-btn">
						Sign Up
					</button>
					<button onClick={login} className="btn-base auth-page-btn">
						Login
					</button>
				</div>

				<button
					onClick={logout}
					className="btn-base auth-page-btn"
				>
					Logout
				</button>
			</form>
			<div className="login-image">
				<img src="src/assets/images/flamenco-camping.webp" alt="" />
			</div>
		</div>
	);
}

export default Playground;