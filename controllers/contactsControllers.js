import contactsServices from "../services/contactsServices.js";

export const getAllContacts = (req, res) => {
    contactsServices
        .listContacts()
        .then((contacts) => res.status(200).json(contacts))
        .catch((error) => res.status(500).json({ error: error.message }));
};

export const getOneContact = (req, res) => {
    const { id } = req.params;

    contactsServices
        .getContactById(id)
        .then((contact) => {
            if (contact !== null) {
                res.status(200).json(contact);
            } else {
                res.status(404).json({ message: "Not found" });
            }
        })
        .catch(() => res.status(404).json({ message: "Not found" }));
};

export const deleteContact = (req, res) => {
    const { id } = req.params;

    contactsServices
        .removeContact(id)
        .then((contact) => {
            if (contact !== null) {
                res.status(200).json(contact);
            } else {
                res.status(404).json({ message: "Not found" });
            }
        })
        .catch(() => res.status(500).json({ message: "Failed to delete contact" }));
};

export const createContact = (req, res) => {
    const { name, email, phone } = req.body;

    contactsServices
        .addContact(name, email, phone)
        .then((contact) => res.status(201).json(contact))
        .catch(() => res.status(400).json({ message: "Failed to create contact" }));
};

export const updateContact = (req, res) => {
  const { id } = req.params;

  const { name, email, phone } = req.body;

  if (name === undefined && email === undefined && phone === undefined) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" });
  }

  contactsServices
    .updateContact(id, name, email, phone)
    .then((contact) => {
      if (contact !== null) {
        res.status(200).json(contact);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    })
    .catch(() => res.status(404).json({ message: "Not found" }));
};