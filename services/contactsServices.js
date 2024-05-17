import Contact from "../models/contacts.js";

async function listContacts() {
    
    try {
      const data = await Contact.find();
      return data;
    }
    catch (error) { 
      next(error);
    }
}

async function getContactById(contactId) {
    
    try {
     const data = await listContacts();
    const contact = data.find((contact) => contact.id === contactId);
    return contact || null;
      } catch (error) {
      next(error);
    }
}

async function removeContact(contactId) {
  
  try {
    const data = await Contact.findByIdAndDelete(contactId);
    return data;
  } catch (error) {
    next(error);
  }
}

async function addContact (name, email, phone, favorite = false) {
  const newContact = {
    name: name,
    email: email,
    phone: phone,
    favorite: favorite,
  }
    
    try {
      const data = await Contact.create(newContact);
      console.log(data);
      return data;
        }
       catch (error) {
      next(error);
    }
    
}

async function updateContact(contactId, name, email, phone, favorite) {

  const contactToUpdate = await getContactById(contactId);
  
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
  console.log(result)
    return result;
  } catch (error) {
  next(error);
  }
  };
  
async function updateContactFavorite(id, favoriteStatus) {
  try {
    const result = await updateContact(id, favoriteStatus);
    return result;
  } catch (error) {
    next(error);
  }
}



export default {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateContactFavorite,
};