import Contact from "../models/contacts.js";

async function listContacts(filter, page, limit) {

     try {
    const skip = (page - 1) * limit;
    const contacts = await Contact.find(filter).skip(skip).limit(limit);

    const total = await Contact.countDocuments(filter);
    return {
      total,
      page,
      limit,
      contacts,
    };
  } catch (error) {
       throw error;
  }
}

async function getContactById(contactId, ownerId) {
    
    try {
    const contact = await Contact.findOne({ _id: contactId, owner: ownerId });
    return contact;
      } catch (error) {
        throw error;
    }
}

async function removeContact(contactId, ownerId) {
  
  try {
    const data = await Contact.findOneAndDelete({
      _id: contactId,
       owner: ownerId,
    });
    return data;
  } catch (error) {
    throw error;
  }
}

async function addContact(ownerId, name, email, phone, favorite) {

  const isFavorite = favorite === "true" || favorite === true;
  
  const newContact = {
    name: name,
    email: email,
    phone: phone,
    favorite: isFavorite,
    owner: ownerId,
  }
    
    try {
      const data = await Contact.create(newContact);
      return data;
        }
       catch (error) {
        throw error;
    }
    
}

async function updateContact(contactId, ownerId, name, email, phone, favorite) {
const contactToUpdate = await Contact.findOne({
    _id: contactId,
    owner: ownerId,
  });
  
  if (contactToUpdate === null) {
    return null;
  }
      const newContact = {
        name: name !== undefined ? name : contactToUpdate.name,
        email: email !== undefined ? email : contactToUpdate.email,
        phone: phone !== undefined ? phone : contactToUpdate.phone,
        favorite: favorite !== undefined ? favorite : contactToUpdate.favorite,
      };   

try {   
  const result = await Contact.findByIdAndUpdate(contactId, newContact, {
    new: true,
  });
    return result;
  } catch (error) {
   throw error;
  }
  };


export default {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
};