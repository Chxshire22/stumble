import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase";
import { ToastContainer, toast } from "react-toastify";
import { Toast } from "react-bootstrap";

function LoginSignout(props) {

	let { setUser, user, toastConfig } = props;

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	useEffect(() => {
		onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
		console.log(user);
	}, [user]);

	const navigate = useNavigate();

	//if not logged in push to login
	useEffect(() => {
		if (auth.currentUser) {
			navigate("/");
		}
	}, [auth.currentUser]);



	const register = async (e) => {
		e.preventDefault();
		try {
			const user = await createUserWithEmailAndPassword(auth, email, password);
			console.log(user);
			console.log(auth);
			setEmail("");
			setPassword("");
			toast.success("Successfully registered", toastConfig)
			navigate("/set-profile");
		} catch (error) {
			console.log(error.message);
			toast.error("Invalid registration details", toastConfig)
		}
	};

	const login = async (e) => {
		e.preventDefault();
		try {
			const user = await signInWithEmailAndPassword(auth, email, password);
			console.log(user);
			console.log(auth);
			setEmail("");
			setPassword("");
			toast.success("Successfully logged in", toastConfig)
			navigate("/");
		} catch (error) {
			console.log(error.message);
			toast.error("Invalid login details", toastConfig)
		}
	};

	return (
		<div className="authentication flex-center-col">
			<ToastContainer
				position="top-right"
				autoClose={2500}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="colored"
			/>
			<header className="auth-header">
				<div className="auth-header-logo">
					<img
						className="logo-earth"
						src="https://firebasestorage.googleapis.com/v0/b/stumble-a6ed0.appspot.com/o/assets%2Fflamenco-134.webp?alt=media&token=8d349e22-4beb-4bb2-996e-f93aece0c6b9"
						alt=""
					/>
				</div>
				<div className="auth-header-content">
					<h1 className="auth-page-header">Stumble</h1>
					<p className="tagline">
						{user?.email ? user?.email : `explore with us!`}
					</p>
				</div>
			</header>
			<form className="auth-form flex-center-col">
				<input
					value={email}
					autoFocus
					placeholder="Email"
					className="form-input"
					type="email"
					onChange={(e) => {
						setEmail(e.target.value);
					}}
				/>
				<input
					value={password}
					placeholder="Password"
					className="form-input"
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
			</form>
			<div className="login-image">
				<img
					src="https://firebasestorage.googleapis.com/v0/b/stumble-a6ed0.appspot.com/o/assets%2Fflamenco-camping.webp?alt=media&token=f6527dd8-bd29-4e8f-a49c-40630c29eb3c"
					alt=""
				/>
			</div>
		</div>
	);
}

export default LoginSignout;
