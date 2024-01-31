import { zfd } from "zod-form-data"

const UserSchema = zfd.formData({
    email: zfd.text(),
    password: zfd.text()
})

export { UserSchema }
