
module.exports = (sequelize,DataTypes)=>{

    const User = sequelize.define('User_ORM',{
        user_name : {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email : {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password : {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
    return User
}

