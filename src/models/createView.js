const createView = (props) => {
    return {
        username: "",
        email: "",
        password: "",
        errorMessage: "",
        ...props
    };
}

module.exports = createView