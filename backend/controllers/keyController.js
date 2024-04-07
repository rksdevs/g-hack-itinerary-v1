export const getGoogleMapKey = (req, res) => {
    const key = process.env.GOOGLE_MAP_KEY;
    res.status(200).json(key)
}