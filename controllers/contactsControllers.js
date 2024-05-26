import contactsServices from "../services/contactsServices.js";
import { isValidObjectId } from "mongoose";

// getAllContacts
export const getAllContacts = (req, res, next) => {
  let { page = 1, limit = 20, favorite } = req.query;
  
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);
  const filter = {
    owner: req.user.id,
  };

  if (favorite === "true") {
    filter.favorite = true;
  } else if (favorite === "false") {
    filter.favorite = false;
  }

  if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
    return res.status(400).json({ message: "Bad request." });
  }
    contactsServices
        .listContacts(filter, page, limit)
        .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};

// getOneContact
export const getOneContact = (req, res, next) => {
  const { id } = req.params;
  
if (!isValidObjectId(id)) {
    return res.status(404).json({ message: "This identifier is not valid" });
  }
    contactsServices
        .getContactById(id, req.user.id)
         .then((contact) => {
      if (contact === null) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(200).json(contact);
    })
    .catch((err) => next(err));
};

// deleteContact
export const deleteContact = (req, res, next) => {
    const { id } = req.params;

     if (!isValidObjectId(id)) {
    return res.status(404).json({ message: "This identifier is not valid" });
  }
  contactsServices
    .removeContact(id, req.user.id)
    .then((contact) => {
      if (contact == null) {
        return res.status(404).json({ message: "Not found" });
      }
      res.status(200).json(contact);
    })
    .catch((err) => next(err));
};

// createContact
export const createContact = (req, res, next) => {
  const { name, email, phone, favorite = false } = req.body;
  
  const isFavorite = favorite === "true" || favorite === true;
  
  contactsServices
    .addContact(req.user.id, name, email, phone, isFavorite)
    .then((contact) => {
      res.status(201).json(contact);
    })
    .catch((err) => next(err));
};

// updateContact
export const updateContact = (req, res, next) => {
  const { id } = req.params;

    if (!isValidObjectId(id)) {
    return res.status(404).json({ message: "This identifier is not valid" });
  }
  const { name, email, phone, favortie } = req.body;

  if (name === undefined && email === undefined && phone === undefined) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" });
  }

  contactsServices
    .updateContact(id, req.user.id, favortie, name, email, phone)
    .then((contact) => {
      if (contact == null) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(200).json(contact);
    })
    .catch((err) => next(err));

}

// updateContactFavorite
export const updateContactFavorite = (req, res, next) => {
  const { id } = req.params;
  
   if (!isValidObjectId(id)) {
    return res.status(404).json({ message: "This identifier is not valid" });
  }
    
    const { favorite } = req.body;
    
  contactsServices
    .updateContact(id, req.user.id, favorite)
    .then((contact) => {
      if (contact == null) {
        return res.status(404).json({ message: "Not found" });
      }
      res.status(200).json(contact);
    })
    .catch((err) => next(err));
};