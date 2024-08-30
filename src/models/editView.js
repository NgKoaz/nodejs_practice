const editView = (props) => {
    return {
        id: -1,
        username: "",
        email: "",
        password: "",
        errorMessage: "",
        ...props
    }
}

module.exports = editView;