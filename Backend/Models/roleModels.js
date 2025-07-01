// Role Collection models
class RoleSchema {
    constructor(
        roleId, 
        companyId, 
        role, 
        createdAt, 
        updatedAt
    ) {
        this.roleId = roleId;
        this.companyId = companyId;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}