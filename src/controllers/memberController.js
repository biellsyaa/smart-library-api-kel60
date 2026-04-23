import { MemberModel } from '../models/memberModel.js';

export const MemberController = {

  // GET ALL (+ optional search by name/email)
  async getAllMembers(req, res) {
    try {
      const { name, email } = req.query;

      let members;

      if (name || email) {
        members = await MemberModel.search(name, email);
      } else {
        members = await MemberModel.getAll();
      }

      res.json(members);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET BY ID
  async getMemberById(req, res) {
    try {
      const { id } = req.params;
      const member = await MemberModel.getById(id);
      res.json(member);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // CREATE
  async registerMember(req, res) {
    try {
      const newMember = await MemberModel.create(req.body);
      res.status(201).json({
        message: "Anggota berhasil didaftarkan!",
        data: newMember
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // UPDATE
  async updateMember(req, res) {
    try {
      const { id } = req.params;
      const updated = await MemberModel.update(id, req.body);
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // DELETE
  async deleteMember(req, res) {
    try {
      const { id } = req.params;
      await MemberModel.delete(id);
      res.json({ message: "Member deleted" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

};