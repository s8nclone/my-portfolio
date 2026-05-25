import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	"http://localhost:5050"
);

// const scopes = [
// 	"https://mail.google.com/",
// ];

// const url = oauth2Client.generateAuthUrl({
// 	access_type: "offline",
// 	scope: scopes,
// 	prompt: "consent",
// });
const code = "4/0AeoWuM_Ns-ih_-2YKCEvIgy01rcbH9PZvons-H0okavwrcerWQJIFZcCrblX_oT5jooSeA"

async function getRefreshToken() {

	const { tokens } = await oauth2Client.getToken(code);

	console.log(tokens);
}

getRefreshToken();