import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

//Authorization of user and getting the token
//route - /api/users/login - POST request
//access - Public

const authUser = asyncHandler(async(req,res) => {
    // destructuring the email and password from req.body
    const {email, password} = req.body;
    // check for the user in the database
    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))){
        //creating the json web token
        
        generateToken(res,user._id);
        
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    }
    else{
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

//Registration of user 
//route - /api/users - POST request
//access - Public
const registerUser = asyncHandler(async(req,res) => {
    const {name, email, password} = req.body;

    const userExists = await User.findOne({ email });

    if(userExists) {
        res.status(400);
        throw new Error('User already exists')
    }

    const user = await User.create({
        name,
        email, 
        password
    });

    if (user) {
        generateToken(res,user._id);
        
        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            isAdmin : user.isAdmin,
        });
    }
    else{
        res.status(400);
        throw new Error('Invalid user data');
    }
});

//Logout the user / clear cookie 
//route - /api/users/logout - POST request
//access - Private
const logoutUser = asyncHandler(async(req,res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),

    } );

    res.status(200).json({message : 'Logged Out Successfully'});
});


//Get user profile 
//route - /api/users/profile - GET request
//access - Private
const getUserProfile = asyncHandler(async(req,res) => {
    const user = await User.findById(req.user._id);

    if(user){
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    }
    else{
        res.status(404);
        throw new Error('User not found');
    }
});

//Update the user profile
//route - /api/users/profile - PUT request
//access Private
const UpdateUserProfile = asyncHandler(async(req,res) => {
    const user = await User.findById(req.user._id);

    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if(req.body.password){
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id : updatedUser._id,
            name : updatedUser.name,
            email : updatedUser.email,
            isAdmin : updatedUser.isAdmin,
        })
    }

    else{
        res.status(404);
        throw new Error('User not found');
    }
});

//Get all the users profile - basically an admin funtion
//route - /api/users - GET request
//access Private/Admin
const getUsers = asyncHandler(async(req,res) => {
    res.send('get users');
});

//Get the user by id
//route - /api/users/:id - GET request 
//access Private/Admin
const getUserById = asyncHandler(async(req,res) => {
    res.send('get user by id');
});


//Delete a user profile
//route - /api/users/:id - DELETE request
//access Private/Admin
const deleteUser = asyncHandler(async(req,res) => {
    res.send('delete user');
});

//Update the user
//route - /api/users/:id - PUT request 
//access Private/Admin
const updateUser = asyncHandler(async(req,res) => {
    res.send('Update the user');
});

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    UpdateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
}


