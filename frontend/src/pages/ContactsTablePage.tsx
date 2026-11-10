import Table from "@/components/Table";
import useContacts from "@/hooks/useContacts";

const ContactsTablePage = () => {
  const { data: contacts, isLoading } = useContacts()
  return (
    <div className="page">
      <div className="paper container">
        <div className="field">
          <input className="input" placeholder="Поиск..." />
        </div>
        <div className="divider" />
        <Table isLoading={isLoading} data={contacts?.data}/>
      </div>
    </div>
  );
};

export default ContactsTablePage;
