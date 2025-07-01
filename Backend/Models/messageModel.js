const { messagingSenderId } = require("../Config/firebaseConfig");

class MessageSchema {
    constructor(
        messageId,
        companyId,
        staffId,
        sender,
        message,
        createdAt, 
    ) {
        this.messageId = messageId;
        this.companyId = companyId;
        this.staffId = staffId;
        this.sender = sender;
        this.message = message;
        this.createdAt = createdAt;
    }
        
    
}