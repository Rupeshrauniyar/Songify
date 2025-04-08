const axios = require('axios');

const dotenv = require('dotenv');
dotenv.config();

const getAudio = async (req, res) => {
    const { id } = req.body;
    console.log(id)
    const options = {
        method: 'GET',
        url: 'https://youtube-mp36.p.rapidapi.com/dl',
        params: { id },
        headers: {
            'x-rapidapi-key': process.env.RAPID_API_KEY,
            'x-rapidapi-host': process.env.RAPID_API_HOST
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            console.log(response.data);
            if (response.data) {
                res.status(200).json({
                    success: true,
                    message: 'Audio downloaded successfully',
                    data: response.data
                });
            } else {
                res.status(400).json({ success: false, message: 'Audio not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, message: 'Audio not found' });

        }
    }

    fetchData();


    res.status(200).json({
        success: true,
        message: 'Audio downloaded successfully',
        data: { link: "https://beta.123tokyo.xyz/get.php/e/f3/cTtUOtiVUXQ.mp3?n=JAWAN_%20Aararaari%20Raaro%20_%20Shah%20Rukh%20Khan%20_%20Atlee%20_%20Anirudh%20_%20Nayanthara%20_Deepthi%20Suresh%20_Irshad%20Kamil&uT=R&uN=cnVwZXNocmF1bml5YXI4MA%3D%3D&h=CbhH3dS5W2WzG6wdi0XuxQ&s=1744088518&uT=R&uN=cnVwZXNocmF1bml5YXI4MA%3D%3D" }
    })
}





module.exports = { getAudio };