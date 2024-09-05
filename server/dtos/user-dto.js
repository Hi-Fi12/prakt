module.exports = class UserDto {
    constructor(model) {
        this.id = model.id;
        this.email = model.email;
        this.firstName = model.first_name; // Расширение для нового поля
        this.lastName = model.last_name;   // Расширение для нового поля
        this.dateOfBirth = model.date_of_birth; // Расширение для нового поля
        this.gender = model.gender; // Расширение для нового поля
        this.isActivated = model.isActivated;
        this.phoneNumber = model.phone_number; // Расширение для нового поля
        this.address = model.address; // Расширение для нового поля
    }
};