import { zfd } from "zod-form-data"

const TweetSchema = zfd.formData({
    userId: zfd.numeric(),
    title: zfd.text(),
    description: zfd.text(),
})

export { TweetSchema }
