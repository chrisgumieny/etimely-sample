
class AnnouncementSchema {
    constructor(
        announcementId,
        businessId,
        title,
        details,
        createdAt
    ) {
        this.announcementId = announcementId;
        this.businessId = businessId;
        this.title = title;
        this.details = details;
        this.createdAt = createdAt;
    }
}

module.exports = AnnouncementSchema;