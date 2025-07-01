
class AvailabilitySchema {
    constructor(
        availabilityId,
        staffId,
        start,
        end,
        createdAt,
        updatedAt,
        isApproved
    ) {
        this.availabilityId = availabilityId;
        this.staffId = staffId;
        this.startTime = start;
        this.endTime = end;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isApproved = isApproved;
    }
}

module.exports = AvailabilitySchema;