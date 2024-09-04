function formataTelefone(phoneNumber: string): string {
    if (phoneNumber.length === 11) {
      const ddd = phoneNumber.slice(0, 2);
      const firstPart = phoneNumber.slice(2, 7);
      const secondPart = phoneNumber.slice(7, 11);
  
      return `(${ddd}) ${firstPart}-${secondPart}`;
    } else {
      // Caso o telefone não tenha 11 dígitos
      return phoneNumber;
    }
}

export default formataTelefone;