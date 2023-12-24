export default function SetProfile() {
	return (
		<div className="flex-center-col">
		<div className="pfp-container set-profile-picture"></div>
		<form className="flex-center-col" action="">
		<input type="file" name="" id="" className="upload-pfp"/>
		<input className="username" type="text" name="" id=""/>
		<textarea className="user-bio" name="" id="" cols="30" rows="2"></textarea>
		</form>
		<button className="btn-base">Next</button>
		</div>
	)
}
