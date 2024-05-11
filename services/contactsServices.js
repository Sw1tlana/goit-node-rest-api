import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";


const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
    
    try {
        const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
        return JSON.parse(data)
    }
    catch (error) { 
         if (error.code === 'ENOENT') {
      return [];
    }
    }
}

async function getContactById(contactId) {
    
    try {
        const data = await listContacts();

        const contact = data.find(contact => contact.id === contactId) ;
    return contact || null;

    } catch (error) {
        throw error;
    }
}

async function removeContact(contactId) {
    
    try {
        const contact = await getContactById(contactId);
        if ( contact === null) {
            return null;
        }
        else {
            const data = await listContacts();
            
            const newData = data.filter(contact => contact.id !== contactId);
            await fs.writeFile(contactsPath, JSON.stringify(newData, null, 2));
            return contact;
        }
    } catch (error) {
        throw error;
    }
}

async function addContact(name, email, phone) {
    
    try {
        const data = await listContacts();
        const newContact = {
            id: crypto.randomUUID(),
            name,
            email,
            phone,
        }
        data.push(newContact);
        await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
        return newContact;
    } catch (error) {
        throw error;
    }
    
}

export default { listContacts, getContactById, removeContact, addContact };