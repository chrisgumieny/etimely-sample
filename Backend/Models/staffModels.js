// Staff Collection models
class StaffSchema {
    constructor(
        staffId, 
        staffFirstName, 
        staffLastName, 
        staffEmail, 
        password,
        companyId, 
        resetPasswordToken, 
        resetPasswordExpires,
        isVerified,
        createdAt,
        updatedAt
    ) {
        this.staffId = staffId;
        this.staffFirstName = staffFirstName;
        this.staffLastName = staffLastName;
        this.staffEmail = staffEmail;
        this.password = password;
        this.resetPasswordToken = resetPasswordToken;
        this.resetPasswordExpires = resetPasswordExpires;
        this.isVerified = isVerified;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.companyId = companyId;
    }
}

module.exports = StaffSchema;