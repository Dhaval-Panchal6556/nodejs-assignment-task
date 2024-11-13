import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtPayload } from "../interfaces/jwt.interface";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class CommonService {
  constructor(private jwtService: JwtService) {}

  /**
   * Hashes a password using bcrypt with the specified salt rounds.
   * @param {string} password - The plain text password to be hashed.
   * @param {number} salt - The number of salt rounds to use for hashing.
   * @returns {Promise<string>} - A promise that resolves to the hashed password.
   */
  async bcryptPassword(password: string, salt: number): Promise<string> {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  /**
   * Generates a JWT authentication token for the user.
   * @param {any} user - The user object containing user details (id, email, role, type).
   * @returns {Promise<string>} - A signed JWT token.
   */
  async generateAuthToken(user) {
    const payload: JwtPayload = {
      _id: user.id,
      email: user.email,
      role: user.role,
      type: user.type,
    };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_TOKEN_SECRET,
      expiresIn: process.env.JWT_TONE_EXPIRY_TIME,
    });
  }

  /**
   * Create random string
   * @param {number} length
   * @param {string|null} type
   * @return {string}
   */
  async generateRandomString(length: number, type: string = null) {
    let charSet = "";
    let randomString = "";
    if (type === "number") {
      charSet = "123456789";
    } else {
      charSet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    }

    for (let i = 0; i < length; i++) {
      const randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
  }
}
