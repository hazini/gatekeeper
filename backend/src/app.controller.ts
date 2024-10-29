import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    // Log the current directory on startup
    console.log('Current directory:', process.cwd());
    console.log('__dirname:', __dirname);
    
    // Check if files exist in various locations
    const paths = [
      join(process.cwd(), 'backend', 'public', 'index.html'),
      join(process.cwd(), 'backend', 'dist', 'public', 'index.html'),
      join(__dirname, '..', 'public', 'index.html')
    ];
    
    paths.forEach(path => {
      console.log(`Checking path: ${path}`);
      console.log(`File exists: ${fs.existsSync(path)}`);
    });
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('index.html')
  serveIndex(@Res() res: Response) {
    // Try multiple possible paths
    const possiblePaths = [
      join(process.cwd(), 'backend', 'public', 'index.html'),
      join(process.cwd(), 'backend', 'dist', 'public', 'index.html'),
      join(__dirname, '..', 'public', 'index.html')
    ];

    for (const filePath of possiblePaths) {
      console.log(`Trying path: ${filePath}`);
      if (fs.existsSync(filePath)) {
        console.log(`Found file at: ${filePath}`);
        return res.sendFile(filePath);
      }
    }

    res.status(404).send('File not found. Tried paths: ' + possiblePaths.join(', '));
  }

  @Get('init.js')
  serveInitJs(@Res() res: Response) {
    // Try multiple possible paths
    const possiblePaths = [
      join(process.cwd(), 'backend', 'public', 'init.js'),
      join(process.cwd(), 'backend', 'dist', 'public', 'init.js'),
      join(__dirname, '..', 'public', 'init.js')
    ];

    for (const filePath of possiblePaths) {
      console.log(`Trying path: ${filePath}`);
      if (fs.existsSync(filePath)) {
        console.log(`Found file at: ${filePath}`);
        return res.sendFile(filePath);
      }
    }

    res.status(404).send('File not found. Tried paths: ' + possiblePaths.join(', '));
  }
}
