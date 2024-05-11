import contactsService from "../services/contactsServices";

export const getAllContacts = (req, res) => {
    contactsService
        .listContacts()
        .then((contacts) => res.status(200)).json(contacts)
        .catch((error) => res.status(500).json({ error: error.message}))

};

export const getOneContact = (req, res) => {
    const { id } = req.params;
    contactsService
        .getContactById(id)
        .then((contact) => {
            if (contacts !== null) {
            res.status(200)
        }
    })
};

export const deleteContact = (req, res) => {};

export const createContact = (req, res) => {};

export const updateContact = (req, res) => {};