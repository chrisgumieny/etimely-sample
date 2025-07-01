
// Business Collection models
class BusinessSchema {
    constructor(
        companyId, 
        companyName, 
        companyEmail,  
        password, 
        resetPasswordToken, 
        isVerified,
        createdAt,
        updatedAt
    ) {
        this.companyId = companyId;
        this.companyName = companyName;
        this.companyEmail = companyEmail;
        this.password = password;
        this.resetPasswordToken = resetPasswordToken;
        this.isVerified = isVerified;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}



module.exports = BusinessSchema;