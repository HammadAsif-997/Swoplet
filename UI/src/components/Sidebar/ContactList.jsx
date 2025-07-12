import ContactItem from './ContactItem';

const ContactList = ({ contacts, activeContactId, onSelectContact }) => {
  return (
    <div className="pt-2">
      {contacts.length === 0 ? (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          No contacts found
        </div>
      ) : (
        contacts.map((contact) => (
          <ContactItem
            key={contact.id}
            contact={contact}
            isActive={contact.id === activeContactId}
            onClick={() => onSelectContact(contact.id)}
          />
        ))
      )}
    </div>
  );
};

export default ContactList;