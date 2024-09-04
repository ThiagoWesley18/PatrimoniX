import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {RentabilidadeData, RentabilidadeDataChart } from '../types/rentabilidade';

interface Props {
    data: RentabilidadeData[];
}

const RentabilidadePorIndices: React.FC<Props> = ({data}) => {

    function sortRentabilidadeData(data: RentabilidadeData[]): RentabilidadeData[] {
        return data.sort((a, b) => {
            const [monthA, yearA] = a.month.split('/').map(Number);
            const [monthB, yearB] = b.month.split('/').map(Number);
    
            const dateA = new Date(yearA + 2000, monthA - 1); // Assume que o ano está no formato de dois dígitos
            const dateB = new Date(yearB + 2000, monthB - 1);
    
            return dateA.getTime() - dateB.getTime();
        });
    }

    const transformRentabilidade = (data: RentabilidadeData[]): RentabilidadeDataChart[] => {
        const sortedData: RentabilidadeData[] = sortRentabilidadeData(data);
        const filteredData: RentabilidadeDataChart[] = []
        for(const rentabilidade of sortedData){
            filteredData.push({
                month: rentabilidade.month, 
                cdi: rentabilidade.cdi, 
                ibovespa: rentabilidade.ibovespa,
                carteira: rentabilidade.carteira
            })
        }
        return filteredData;
    }
    return (
        <div style={{ width: '100%', height: 400 }} className="text-center">
            <p>Rentabilidade comparada com índices</p>
            <ResponsiveContainer>
                <LineChart
                    data={transformRentabilidade(data)}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value: number) => `${value}%`} />
                    <Tooltip formatter={(value: number) => `${value}%`} />
                    <Legend />
                    <Line type="monotone" dataKey="carteira" stroke="#8884d8" activeDot={{ r: 8 }} name="Carteira" />
                    <Line type="monotone" dataKey="cdi" stroke="#82ca9d" name="cdi" />
                    <Line type="monotone" dataKey="ibovespa" stroke="#ffc658" name="Ibovespa" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RentabilidadePorIndices;