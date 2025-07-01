
// Schedule Collection models
class ScheduleSchema {
    constructor(id, 
        title, 
        scheduleRole, 
        start, 
        end, 
        createdAt, 
        updatedAt
    ) {
        this.id = id;
        this.staffId = title /*staffId*/;
        this.scheduleRole = scheduleRole;
        this.scheduleStartTime = start;
        this.scheduleEndTime = end;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = ScheduleSchema;