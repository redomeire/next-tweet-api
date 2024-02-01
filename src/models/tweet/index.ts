import { zfd } from "zod-form-data"

const TweetSchema = zfd.formData({
    id: zfd.text().optional(),
    userId: zfd.numeric().optional(),
    title: zfd.text(),
    description: zfd.text(),
})

export { TweetSchema }
