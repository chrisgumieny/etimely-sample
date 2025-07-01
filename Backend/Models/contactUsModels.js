// Role Collection models
class ContactUsSchema {
    constructor(
        contactUsid, 
        name, 
        email, 
        message, 
        createdAt
    ) {
        this.contactUsid = contactUsid;
        this.name = name;
        this.email = email;
        this.message = message;
        this.createdAt = createdAt;
    }
}