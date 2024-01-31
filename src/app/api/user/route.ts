export async function GET(request: Request) {
    const users: { name: string }[] = [
        {
            name: "dummy"
        }
    ]

    if (users.length === 0) {
        return Response.json({
            status: '404',
            message: 'user not found',
        })
    }

    return Response.json({
        status: '200',
        message: 'success get users',
        data: users
    })
}
