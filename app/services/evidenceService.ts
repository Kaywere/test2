import pool from '../config/db';

export interface Evidence {
    id: string;
    element_id: string;
    title: string;
    description: string;
    file_type: 'pdf' | 'image';
    file_data: Buffer;
    file_name: string;
    mime_type: string;
    created_at: Date;
    updated_at: Date;
}

export const evidenceService = {
    // Create a new evidence
    async createEvidence(
        elementId: string,
        title: string,
        description: string,
        fileType: 'pdf' | 'image',
        fileData: Buffer,
        fileName: string,
        mimeType: string
    ): Promise<Evidence> {
        const query = `
            INSERT INTO evidences 
            (element_id, title, description, file_type, file_data, file_name, mime_type)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        
        const values = [elementId, title, description, fileType, fileData, fileName, mimeType];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Get evidence by ID
    async getEvidenceById(id: string): Promise<Evidence | null> {
        const query = 'SELECT * FROM evidences WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    },

    // Get all evidences for an element
    async getEvidencesByElementId(elementId: string): Promise<Evidence[]> {
        const query = 'SELECT * FROM evidences WHERE element_id = $1 ORDER BY created_at DESC';
        const result = await pool.query(query, [elementId]);
        return result.rows;
    },

    // Delete evidence
    async deleteEvidence(id: string): Promise<void> {
        const query = 'DELETE FROM evidences WHERE id = $1';
        await pool.query(query, [id]);
    }
}; 