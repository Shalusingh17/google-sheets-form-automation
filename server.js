const express = require("express")
const path = require("path")
const { google } = require("googleapis")

const app = express()

app.use(express.json())
app.use(express.static(__dirname))

const PORT = 3000

const SHEET_ID = "1SQVXYFX4U3eepF7U5pumiAnRTLJjNLFw3atlngVePw"

const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
})

app.post("/add-data", async(req, res) => {
    try {

        const { name, email, message } = req.body

        const client = await auth.getClient()

        const sheets = google.sheets({
            version: "v4",
            auth: client
        })

        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: "Automation Data!A:C",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [
                    [name, email, message]
                ]
            }
        })

        res.send("Data Added Successfully")

    } catch (error) {

        console.log(error)

        res.status(500).send("Error adding data")

    }
})

app.listen(PORT, () => {
    console.log("Server running on port " + PORT)
})